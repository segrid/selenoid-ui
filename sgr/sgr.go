package sgr

import (
	"context"
	"encoding/json"
	"net/http"
	"net/url"

	"github.com/aerokube/selenoid-ui/selenoid"
)

type Config struct {
    UITheme        string         `json:"uiTheme"`       
    CloudProvider  string         `json:"cloudProvider"` 
    RouterRole     string         `json:"routerRole"`    
    ConfigVersion  string         `json:"configVersion"` 
    CloudConfig    CloudConfig    `json:"cloudConfig"`   
    SeleniumConfig SeleniumConfig `json:"seleniumConfig"`
}

type CloudConfig struct {
    ScalingMode          string   `json:"scalingMode"`         
    InstanceType         string   `json:"instanceType"`        
    MaxSessions          int      `json:"maxSessions"`         
    ImageID              string   `json:"imageId"`             
    ImageDiskSize        int      `json:"imageDiskSize"`       
    Zone                 string   `json:"zone"`                
    Region               string   `json:"region"`              
    Arn                  string   `json:"arn"`                 
    NamePrefix           string   `json:"namePrefix"`          
    OSUserName           string   `json:"osUserName"`          
    OSPassword           string   `json:"osPassword"`          
    SecurityGroups       []string `json:"securityGroups"`      
    SubnetIDS            []string `json:"subnetIds"`           
    KeyPair              string   `json:"keyPair"`             
    Tags                 []Tag    `json:"tags"`                
    CleanUpCycle         int64    `json:"cleanUpCycle"`        
    MaxInstances         int64    `json:"maxInstances"`        
    MinAvailableSessions int64    `json:"minAvailableSessions"`
    CleanupOnShutdown    bool     `json:"cleanupOnShutdown"`   
    EnableLogs           bool     `json:"enableLogs"`          
    LogLocation          string   `json:"logLocation"`         
    EnableVideo          bool     `json:"enableVideo"`         
    VideoLocation        string   `json:"videoLocation"`       
    InitScript           string   `json:"initScript"`          
}

type Tag struct {
    Name  string `json:"name"` 
    Value string `json:"value"`
}

type SeleniumConfig struct {
}

type Instance struct {
	InstanceId        		string `json:"instanceId"`
	InstanceName	  		string `json:"instanceName"`
	MaxSessions 			int `json:"maxSessions"`
	CurrentSessionsCount	int `json:"currentSessionsCount"`
	HubReady				bool `json:"hubReady"`
	InstanceState     		string `json:"instanceState"`
	SelenoidUiPort  		int `json:"selenoidUiPort"`
	PrivateIp     			string `json:"privateIp"`
	MarkedForTermination    bool `json:"markedForTermination"`
	SelenoidPort     		int `json:"selenoidPort"`
	InstanceType     		string `json:"instanceType"`
	Region     				string `json:"region"`
}

type Instances struct {
	Count    int         `json:"count"`
	Instances []Instance `json:"instances"`
}

// result - processed selenoid state
type result struct {
	Instances map[string]Instance 	`json:"instances"`
	Config 	 Config					`json:"config"`

	State    selenoid.State         `json:"state"`
	Origin   string                 `json:"origin"`
	Browsers map[string]int         `json:"browsers"`
	Sessions map[string]selenoid.SessionInfo `json:"sessions"`
	Version  string                 `json:"version"`
	Errors   []interface{}          `json:"errors"`
}

func httpDo(ctx context.Context, req *http.Request, handle func(*http.Response, error) error) error {
	// Run the HTTP request in a goroutine and pass the response to handle function
	errChan := make(chan error, 1)
	go func() {
		errChan <- handle(http.DefaultClient.Do(req))
	}()
	select {
	case <-ctx.Done():
		{
			<-errChan // Wait for handle to return.
			return ctx.Err()
		}
	case err := <-errChan:
		{
			return err
		}
	}
}

const (
	instancesPath = "/instances"
	configPath = 	"/config"
)

func Status(ctx context.Context, segridURI *url.URL, seStatus []byte) ([]byte, error) {
	var instances Instances
	var config Config
	
	req, err := http.NewRequest("GET", segridURI.String()+instancesPath, nil)
	if err != nil {
		return nil, err
	}

	if err = httpDo(ctx, req.WithContext(ctx), func(resp *http.Response, err error) error {
		if err != nil {
			return err
		}
		defer resp.Body.Close()
		return json.NewDecoder(resp.Body).Decode(&instances)
	}); err != nil {
		return nil, err
	}

	req, err = http.NewRequest("GET", segridURI.String()+configPath, nil)
	if err != nil {
		return nil, err
	}

	if err = httpDo(ctx, req.WithContext(ctx), func(resp *http.Response, err error) error {
		if err != nil {
			return err
		}
		defer resp.Body.Close()
		return json.NewDecoder(resp.Body).Decode(&config)
	}); err != nil {
		return nil, err
	}

	var status selenoid.Result
	json.Unmarshal(seStatus, &status)
    
	return json.Marshal(toUI(instances, config, status))
}

func toUI(instanceList Instances, config Config, status selenoid.Result) result {
	instances := make(map[string]Instance)

	for _, instance := range instanceList.Instances {
		instances[instance.InstanceId] = instance
	}

	return result{
		Instances:    	instances,
		Config: 		config,
		State: 		  	status.State,
		Origin:			status.Origin,
		Browsers:		status.Browsers,
		Sessions:		status.Sessions,
		Version:		status.Version,
		Errors:			status.Errors,
	}
}
